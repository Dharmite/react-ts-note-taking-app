import { Note } from '../App';
import { Card, Stack, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../assets/styles/NoteList.module.css';

type NoteCardProps = {
    id: Note['id'];
    title: Note['title'];
    tags: Note['tags'];
};

export function NoteCard({ id, title, tags }: NoteCardProps) {
    return (
        <Card
            as={Link}
            to={`/${id}`}
            className={`h-100 text-reset text-decoration-none ${styles.card}`}
        >
            <Card.Body>
                <Stack
                    className='align-items-center justify-content-center h-100'
                    gap={2}
                >
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && (
                        <Stack
                            gap={1}
                            direction='horizontal'
                            className='justify-content-center flex-wrap'
                        >
                            {tags.map((tag) => {
                                return (
                                    <Badge
                                        className='text-truncate'
                                        key={tag.id}
                                    >
                                        {tag.label}
                                    </Badge>
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    );
}
