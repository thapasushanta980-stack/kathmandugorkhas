import { isKG } from "@/content";
import type { Standings } from "@/lib/types";
import { Source } from "./ui";

export function StandingsTable({ table, compact = false }: { table: Standings; compact?: boolean }) {
  return (
    <div style={{ display: "grid", gap: "var(--s-3)" }}>
      <div className="table-scroll">
        <table className="data">
          <caption className="visually-hidden">Points table, {table.season} {table.stage}</caption>
          <thead>
            <tr>
              <th scope="col">Pos</th>
              <th scope="col">Team</th>
              <th scope="col" className="num"><abbr title="Played">P</abbr></th>
              <th scope="col" className="num"><abbr title="Won">W</abbr></th>
              <th scope="col" className="num"><abbr title="Lost">L</abbr></th>
              {!compact && <th scope="col" className="num"><abbr title="No result">NR</abbr></th>}
              <th scope="col" className="num"><abbr title="Net run rate">NRR</abbr></th>
              <th scope="col" className="num"><abbr title="Points">Pts</abbr></th>
              {!compact && <th scope="col">Note</th>}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={r.team} className={isKG(r.team) ? "is-kg" : undefined}>
                <td>{i + 1}</td>
                <td>{r.team}</td>
                <td className="num">{r.p}</td>
                <td className="num">{r.w}</td>
                <td className="num">{r.l}</td>
                {!compact && <td className="num">{r.nr}</td>}
                <td className="num">{r.nrr}</td>
                <td className="num"><b>{r.pts}</b></td>
                {!compact && <td className="muted">{r.note ?? ""}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="source">{table.updatedTo}.</p>
      <Source p={table.provenance} />
    </div>
  );
}
