import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NewNote } from './pages/NewNote';
import { useLocalStorage } from '../hooks/useLocaleStorage';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Home } from './pages/Home';
import { NoteLayout, useNote } from './components/NoteLayout';
import { ShowNote } from './pages/ShowNote';
import { EditNote } from './pages/EditNote';

export type Tag = {
    id: string;
    label: string;
};

export type NoteData = {
    title: string;
    markdown: string;
    tags: Tag[];
};

export type Note = {
    id: string;
} & NoteData;

export type RawNote = {
    id: string;
} & RawNoteData;

export type RawNoteData = {
    title: string;
    markdown: string;
    tagIds: string[];
};

function App() {
    const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
    const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

    const notesWithTags = useMemo(() => {
        return notes.map((note) => {
            return {
                ...note,
                tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
            };
        });
    }, [tags, notes]);

    function onCreateNote({ tags, ...data }: NoteData) {
        setNotes((prevNotes) => {
            return [
                ...prevNotes,
                {
                    ...data,
                    id: uuidV4(),
                    tagIds: tags.map((tag) => {
                        return tag.id;
                    }),
                },
            ];
        });
    }

    function addTag(tag: Tag) {
        setTags((prevTags) => [...prevTags, tag]);
    }

    function onUpdateNote(id: string, { tags, ...data }: NoteData) {
        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id === id) {
                    return {
                        ...note,
                        ...data,
                        tagIds: tags.map((tag) => tag.id),
                    };
                } else {
                    return note;
                }
            });
        });
    }

    function onDeleteNote(id: string) {
        setNotes((prevNotes) => {
            return prevNotes.filter((note) => note.id !== id);
        });
    }

    function updateTag(id: string, label: string) {
        setTags(prevTags => {
          return prevTags.map(tag => {
            if (tag.id === id) {
              return { ...tag, label }
            } else {
              return tag
            }
          })
        })
      }
    
      function deleteTag(id: string) {
        setTags(prevTags => {
          return prevTags.filter(tag => tag.id !== id)
        })
      }

    return (
        <Container className='my-4'>
            <Routes>
                <Route
                    path='/'
                    element={
                        <Home availableTags={tags} notes={notesWithTags} onDeleteTag={deleteTag} onUpdateTag={updateTag} />
                    }
                />
                <Route
                    path='/new'
                    element={
                        <NewNote
                            onSubmit={onCreateNote}
                            onAddTag={addTag}
                            availableTags={tags}
                        />
                    }
                />
                <Route
                    path='/:id'
                    element={<NoteLayout notes={notesWithTags} />}
                >
                    <Route
                        index
                        element={<ShowNote onDeleteNote={onDeleteNote} />}
                    />
                    <Route
                        path='edit'
                        element={
                            <EditNote
                                onSubmit={onUpdateNote}
                                onAddTag={addTag}
                                availableTags={tags}
                            />
                        }
                    />
                </Route>
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </Container>
    );
}

export default App;
