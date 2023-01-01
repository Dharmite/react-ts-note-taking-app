import { NoteForm } from '../components/NoteForm';
import { NoteData, Tag } from '../App';

type NewNoteProps = {
    onSubmit: (data: NoteData) => void;
    onAddTag: (data: Tag) => void;
    availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
    return (
        <>
            <h1 className='mb-4'>Create Note</h1>
            <NoteForm
                onSubmit={onSubmit}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </>
    );
}
