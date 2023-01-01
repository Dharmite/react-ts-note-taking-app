import { Note } from '../App';
import {
    useParams,
    Navigate,
    Outlet,
    useOutletContext,
} from 'react-router-dom';

type NoteLayoutProp = {
    notes: Note[];
};
export function NoteLayout({ notes }: NoteLayoutProp) {
    const { id } = useParams();
    const note = notes.find((note) => note.id === id);
    if (note === null) return <Navigate to='/' replace />;
    return <Outlet context={note} />;
}

export function useNote() {
    return useOutletContext<Note>();
}
