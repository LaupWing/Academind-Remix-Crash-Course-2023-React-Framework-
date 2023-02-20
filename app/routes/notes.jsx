import NewNote, { links as newNoteLinks } from "~/components/NewNote"

const NotesPage = () => {
   return (
      <main>
         <NewNote />
      </main>
   )
}
export default NotesPage

export function links() {
   return [...newNoteLinks()]
}