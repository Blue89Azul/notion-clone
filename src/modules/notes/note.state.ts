import { atom, useAtom } from "jotai";
import { Note } from './note.entity';

const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
    const [notes, setNotes] = useAtom(noteAtom);

    return {
        getAll: () => notes,
        set: (newNotes: Note[]) => {
            setNotes((oldNotes) => {
                const combineNotes = [...oldNotes, ...newNotes];

                const uniqueNotes: { [key: number]: Note } = {};
                for (const note of combineNotes) {
                    uniqueNotes[note.id] = note;
                }

                return Object.values(uniqueNotes);
            });
        },
        getOne: (id: number) => notes.find((note: Note) => note.id == id),
        delete: (id: number) => {

            const findChildrenIds = (parentId: number): number[] => {
                const childrenIds = notes
                    .filter((note) => note.parent_document == parentId)
                    .map((child) => child.id);
                
                return childrenIds.concat(
                    ...childrenIds.map(childId => findChildrenIds(childId))
                )
            }

            const childrenIds = findChildrenIds(id);

            setNotes((oldNotes) => oldNotes.filter((note) => ![...childrenIds, id].includes(note.id)));
        },

        clear: () => setNotes([])
    };
};