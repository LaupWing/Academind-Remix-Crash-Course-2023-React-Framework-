import { json, redirect } from "@remix-run/node"
import { Link, useCatch, useLoaderData } from "@remix-run/react"
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
   if(!notes || notes.length === 0){
      throw json({
         message: "Could not find any notes",
      }, {
         status: 404,
         statusText: "Not Found"
      })
   }
   return json(notes)
}

export async function action({ request }) {
   const formData = await request.formData()
   const noteData = Object.entries(formData)

   if(noteData.title.trim().length < 5){
      return {
         message: "Invalid title - must be at least 5 characters long"
      }
   }

   const existingNotes = await getStoredNotes()
   noteData.id = new Date().toISOString()
   const updatedNotes = existingNotes.concat(noteData)
   await storeNotes(updatedNotes)
   return redirect("/notes")
}

export function links() {
   return [...newNoteLinks(), ...noteListLinks()]
}

export function CatchBoundary() {
   const caughtResponse = useCatch()

   const message = caughtResponse.data?.message || "Data not found"

   return (
      <main className="error">
         <NewNote />
         <p className="info-message">{message}</p>
      </main>
   )
}

export function ErrorBoundary({error}) {
   return (
      <main className="error">
         <h1>An error related to your notes occured!</h1>
         <p>{error.message}</p>
         <p>Back to <Link to={"/"}>safety!</Link></p>
      </main>
   )
}
