import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Note } from '@/modules/notes/note.entity';
import { useDebouncedCallback } from 'use-debounce';

interface SearchModalProps {
  isOpen: boolean;
  notes: Note[];
  onItemSelect: (noteId: number) => void;
  onKeywordChanged: (keyword: string) => void;
  onClose: () => void;
}

export function SearchModal({
  isOpen,
  notes,
  onItemSelect,
  onKeywordChanged,
  onClose,
}: SearchModalProps) {
  // debounceさせる
  const debounced = useDebouncedCallback(onKeywordChanged, 500);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command shouldFilter={false}>
        <CommandInput onValueChange={debounced} placeholder={'キーワードで検索'} />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup>
            {notes?.map((note) => (
              <CommandItem
                key={note.id}
                title={note.title ?? "無題"} // そしたらこのエンティティのtitleプロパティを未入力の場合は無題を入れるというロジックを作ればいいのに。
                onSelect={() => onItemSelect(note.id)}
              >
                <span>{note.title ?? "無題"}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
