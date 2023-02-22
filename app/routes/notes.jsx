import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import NewNote, { links as newNoteLinks } from "~/components/NewNote"
import NoteList, { links as noteListLinks } from "~/components/NoteList"
import { getStoredNotes, storeNotes } from "~/data/notes"

const NotesPage = () => {
   const notes = useLoaderData()
   return (
      <main>
         <NewNote />
         <NoteList notes={notes}/>
      </main>
   )
}
export default NotesPage

export async function loader(){
   const notes = await getStoredNotes()

   return json(notes)
}

export async function action({ request }) {
   const formData = await request.formData()
   const noteDate = Object.entries(formData)
   const existingNotes = await getStoredNotes()
   noteDate.id = new Date().toISOString()
   const updatedNotes = existingNotes.concat(noteDate)
   await storeNotes(updatedNotes)
   return redirect("/notes")
}

export function links() {
   return [...newNoteLinks(), ...noteListLinks()]
}