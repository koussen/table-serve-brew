import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { shop } from "@/lib/shop";

export const Route = createFileRoute("/_authenticated/admin/tables")({
  component: TableCodes,
});

const TABLES = [1, 2, 3, 4, 5];

function TableCodes() {
  const [codes, setCodes] = useState<{ table: number; url: string; png: string }[]>([]);

  useEffect(() => {
    const origin = window.location.origin;
    Promise.all(
      TABLES.map(async (table) => {
        const url = `${origin}/menu?table=${table}`;
        const png = await QRCode.toDataURL(url, {
          width: 600,
          margin: 1,
          color: { dark: "#2b1d17", light: "#ffffff" },
        });
        return { table, url, png };
      }),
    ).then(setCodes);
  }, []);

  return (
    <div>
      <p className="eyebrow">Dine-in</p>
      <h1 className="mt-2 text-2xl font-semibold">Table QR codes</h1>
      <p className="mt-2 max-w-[60ch] text-sm text-foreground/60">
        Print one code per table. Scanning it opens the {shop.name} menu with that table number
        already filled in, so guests just order and we bring it over.
      </p>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-5 rounded-[min(1vw,10px)] bg-espresso px-5 py-2.5 text-sm font-medium text-paper"
      >
        Print all codes
      </button>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {codes.map((c) => (
          <figure
            key={c.table}
            className="rounded-[min(1.4vw,16px)] bg-paper p-5 text-center ring-1 ring-foreground/5"
          >
            <img src={c.png} alt={`QR code for table ${c.table}`} className="mx-auto w-full max-w-[220px]" />
            <figcaption className="mt-3">
              <span className="font-serif text-lg font-semibold">Table {c.table}</span>
              <span className="mt-1 block truncate text-xs text-foreground/45">{c.url}</span>
            </figcaption>
            <a
              href={c.png}
              download={`kape-klase-table-${c.table}.png`}
              className="mt-3 inline-block text-xs font-medium text-clay underline underline-offset-4"
            >
              Download PNG
            </a>
          </figure>
        ))}
      </div>
    </div>
  );
}
