"use client";

import { useRef, useState } from "react";
import { anthem } from "@/content";
import { thumb, watchUrl, YT_HOST } from "@/lib/youtube";

/** Tells the site-wide sound control to stop so two audio sources never overlap. */
export const ANTHEM_MODAL_EVENT = "kg:anthem-modal-open";

/**
 * "Experience the anthem": opens the team's official YouTube upload in an
 * accessible dialog. Nothing loads from YouTube until the dialog opens, and the
 * player keeps YouTube's own controls and branding.
 */
export function AnthemModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    window.dispatchEvent(new Event(ANTHEM_MODAL_EVENT));
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="anthem-cta" onClick={show}>
        <span className="anthem-cta__icon" aria-hidden="true" />
        Experience the anthem
      </button>
      <dialog
        ref={dialogRef}
        className="anthem-modal"
        aria-labelledby="anthem-modal-title"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="anthem-modal__body">
          <div className="anthem-modal__bar">
            <div>
              <p className="kicker">Official anthem</p>
              <h2 id="anthem-modal-title" className="anthem-modal__title">{anthem.title}</h2>
            </div>
            <button type="button" className="sound__close" onClick={close} aria-label="Close the anthem" autoFocus>×</button>
          </div>
          <div className="yt__frame">
            {open ? (
              <iframe
                src={`${YT_HOST}/embed/${anthem.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={anthem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <img src={thumb(anthem.id)} alt="" width={480} height={360} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
          <p className="source">
            From the <a href={anthem.channelUrl} rel="noopener noreferrer" target="_blank">{anthem.channel}</a> YouTube channel ·{" "}
            <a href={watchUrl(anthem.id)} rel="noopener noreferrer" target="_blank">Open on YouTube</a>
          </p>
        </div>
      </dialog>
    </>
  );
}
