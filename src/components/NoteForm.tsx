import { Form, Stack, Row, Col, Button } from 'react-bootstrap/';
import CreteableReactSelect from 'react-select/creatable';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useRef, useState } from 'react';
import { NoteData, Tag } from '../App';
import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
    onSubmit: (note: NoteData) => void;
    onAddTag: (data: Tag) => void;
    availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
    onSubmit,
    onAddTag,
    availableTags,
    markdown = '',
    tags = [],
    title = '',
}: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        });

        navigate('..');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                required
                                defaultValue={title}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreteableReactSelect
                                isMulti={true}
                                value={selectedTags.map((tag) => ({
                                    label: tag.label,
                                    value: tag.id,
                                }))}
                                onCreateOption={(label) => {
                                    const newTag = { id: uuidV4(), label };
                                    onAddTag(newTag);
                                    setSelectedTags((prevSelectedTags) => [
                                        ...prevSelectedTags,
                                        newTag,
                                    ]);
                                }}
                                options={availableTags.map((tag) => {
                                    return {
                                        label: tag.label,
                                        value: tag.id,
                                    };
                                })}
                                onChange={(tags) =>
                                    setSelectedTags(
                                        tags.map((tag) => ({
                                            label: tag.label,
                                            id: tag.value,
                                        }))
                                    )
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId='markdown'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={15}
                        ref={markdownRef}
                        required
                        defaultValue={markdown}
                    />
                </Form.Group>
                <Stack
                    direction='horizontal'
                    gap={2}
                    className='justify-content-end'
                >
                    <Button type='submit' variant='primary'>
                        Save
                    </Button>
                    <Link to='..'>
                        <Button type='button' variant='outline-secondary'>
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    );
}
