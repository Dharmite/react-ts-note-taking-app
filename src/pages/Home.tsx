import { useMemo, useState } from 'react';
import { Stack, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select/';
import { Note, Tag } from '../App';
import { EditTagsModal } from '../components/EditTagsModal';
import { NoteCard } from '../components/NoteCard';

type HomeProps = {
    availableTags: Tag[];
    notes: Note[];
    onDeleteTag: (id: string) => void;
    onUpdateTag: (id: string, label: string) => void;
};

export function Home({
    availableTags,
    notes,
    onUpdateTag,
    onDeleteTag,
}: HomeProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(
            (note) =>
                title === '' ||
                (note.title.includes(title.toLocaleLowerCase()) &&
                    (selectedTags.length === 0 ||
                        selectedTags.every((selectedTag) =>
                            note.tags.some(
                                (noteTag) => noteTag.id === selectedTag.id
                            )
                        )))
        );
    }, [title, selectedTags, notes]);

    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>

                <Col xs='auto'>
                    <Stack direction='horizontal' gap={2}>
                        <Link to='/new'>
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button
                            variant='outline-secondary'
                            onClick={() => setEditTagsModalIsOpen(true)}
                        >
                            Edit Tags
                        </Button>
                    </Stack>
                </Col>
            </Row>

            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(() => e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map((tag) => {
                                    return { label: tag.label, value: tag.id };
                                })}
                                options={availableTags.map((tag) => {
                                    return { label: tag.label, value: tag.id };
                                })}
                                onChange={(tags) => {
                                    setSelectedTags(
                                        tags.map((tag) => {
                                            return {
                                                label: tag.label,
                                                id: tag.value,
                                            };
                                        })
                                    );
                                }}
                                isMulti
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {filteredNotes.map((note) => {
                    const { markdown, ...noteCardData } = note;
                    return (
                        <Col key={note.id}>
                            <NoteCard {...noteCardData} />
                        </Col>
                    );
                })}
            </Row>

            <EditTagsModal
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
                show={editTagsModalIsOpen}
                handleClose={() => setEditTagsModalIsOpen(false)}
                availableTags={availableTags}
            />
        </>
    );
}
