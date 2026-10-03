import type { GuestNote } from "@/lib/types/rental"
import { cn } from "@/lib/utils"

/**
 * Notas del operador para el cliente (P1-5): combustible, recogida, a quién
 * llamar. Sale en el checkout, en la confirmación y en la página del viaje.
 *
 * Texto plano: se pinta tal cual con sus saltos de línea, nunca como HTML. Lo
 * escribe el operador en el admin y lo lee cualquiera en la tienda.
 */
export function GuestNotes({
  notes,
  className,
}: {
  notes: GuestNote[]
  className?: string
}) {
  if (!notes.length) {
    return null
  }

  return (
    <section
      aria-labelledby="guest-notes-heading"
      className={cn(
        "rounded-xl border border-neutral-200 p-4 dark:border-neutral-800",
        className
      )}
    >
      <h3 id="guest-notes-heading" className="text-[15px] font-semibold">
        Good to know
      </h3>
      <ul className="mt-3 space-y-3">
        {notes.map((note) => (
          <li key={note.id} className="text-sm leading-relaxed">
            {note.title && <p className="font-medium">{note.title}</p>}
            <p className="whitespace-pre-line text-neutral-600 dark:text-neutral-400">
              {note.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
