"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editorState, setEditorState] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isCode: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    isCodeBlock: false,
    isLink: false,
    currentHeading: "p" as string,
  });

  // Memoize extensions to prevent re-initialization
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "my-bullet-list",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "my-ordered-list",
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "my-heading",
          },
        },
        bold: {
          HTMLAttributes: {
            class: "my-bold",
          },
        },
        italic: {
          HTMLAttributes: {
            class: "my-italic",
          },
        },
        strike: {
          HTMLAttributes: {
            class: "my-strike",
          },
        },
        code: {
          HTMLAttributes: {
            class: "my-inline-code",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "my-blockquote",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "my-code-block",
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "my-underline",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer my-link",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-image",
        },
        allowBase64: true,
      }),
      CharacterCount.configure({
        limit: null,
      }),
    ],
    []
  );

  // Initialize editor with stable configuration
  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
        spellcheck: "false",
      },
      handleDOMEvents: {
        // Prevent default behavior that might interfere with formatting
        keydown: () => {
          // Allow default TipTap keyboard shortcuts
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // Update state when editor content changes
      updateEditorState(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      // Update state when selection changes
      updateEditorState(editor);
    },
    onFocus: ({ editor }) => {
      // Update state when editor gains focus
      updateEditorState(editor);
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  // Function to update editor state
  const updateEditorState = useCallback((editor: Editor) => {
    if (!editor) return;

    const newState = {
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isUnderline: editor.isActive("underline"),
      isStrike: editor.isActive("strike"),
      isCode: editor.isActive("code"),
      isBulletList: editor.isActive("bulletList"),
      isOrderedList: editor.isActive("orderedList"),
      isBlockquote: editor.isActive("blockquote"),
      isCodeBlock: editor.isActive("codeBlock"),
      isLink: editor.isActive("link"),
      currentHeading: editor.isActive("heading", { level: 1 })
        ? "1"
        : editor.isActive("heading", { level: 2 })
        ? "2"
        : editor.isActive("heading", { level: 3 })
        ? "3"
        : editor.isActive("heading", { level: 4 })
        ? "4"
        : editor.isActive("heading", { level: 5 })
        ? "5"
        : editor.isActive("heading", { level: 6 })
        ? "6"
        : "p",
    };

    setEditorState(newState);
  }, []);

  // Update state when editor is ready
  useEffect(() => {
    if (editor) {
      updateEditorState(editor);
    }
  }, [editor, updateEditorState]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Enhanced command execution with proper focus and error handling
  const executeCommand = useCallback(
    (command: () => void) => {
      if (!editor) return;

      try {
        // Ensure editor has focus before executing command
        if (!editor.isFocused) {
          editor.commands.focus();
        }

        // Execute the command
        const result = command();

        // Force update of editor state
        setTimeout(() => {
          updateEditorState(editor);
        }, 0);

        return result;
      } catch (error) {
        console.error("Command execution failed:", error);
      }
    },
    [editor, updateEditorState]
  );

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      executeCommand(() => {
        if (editor.state.selection.empty) {
          // If no text is selected, insert link with URL as text
          return editor
            .chain()
            .focus()
            .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
            .run();
        } else {
          // If text is selected, apply link to selection
          return editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: linkUrl })
            .run();
        }
      });
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  }, [editor, linkUrl, executeCommand]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      executeCommand(() => {
        return editor.chain().focus().setImage({ src: imageUrl }).run();
      });
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  }, [editor, imageUrl, executeCommand]);

  if (!editor) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="border rounded-lg bg-white shadow-sm">
          <div className="p-8 text-center text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0 transition-all duration-200"
      type="button"
    >
      {children}
    </Button>
  );

  return (
    <div className="w-full">
      <div className="rounded-lg bg-white shadow-sm overflow-hidden border border-black/10">
        {/* Toolbar */}
        <div className="border-b border-black/10 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo/Redo */}
            <ToolbarButton
              onClick={() =>
                executeCommand(() => editor.chain().focus().undo().run())
              }
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() => editor.chain().focus().redo().run())
              }
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Formatting */}
            <ToolbarButton
              onClick={() =>
                executeCommand(() => editor.chain().focus().toggleBold().run())
              }
              isActive={editorState.isBold}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleItalic().run()
                )
              }
              isActive={editorState.isItalic}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleUnderline().run()
                )
              }
              isActive={editorState.isUnderline}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleStrike().run()
                )
              }
              isActive={editorState.isStrike}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() => editor.chain().focus().toggleCode().run())
              }
              isActive={editorState.isCode}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Headings */}
            <select
              value={editorState.currentHeading}
              onChange={(e) => {
                const level = e.target.value;
                executeCommand(() => {
                  if (level === "p") {
                    return editor.chain().focus().setParagraph().run();
                  } else {
                    return editor
                      .chain()
                      .focus()
                      .toggleHeading({
                        level: Number.parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6,
                      })
                      .run();
                  }
                });
              }}
              className="h-8 text-sm border border-black/50 rounded px-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="p">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists and Blockquote */}
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleBulletList().run()
                )
              }
              isActive={editorState.isBulletList}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleOrderedList().run()
                )
              }
              isActive={editorState.isOrderedList}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleBlockquote().run()
                )
              }
              isActive={editorState.isBlockquote}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                executeCommand(() =>
                  editor.chain().focus().toggleCodeBlock().run()
                )
              }
              isActive={editorState.isCodeBlock}
              title="Code Block"
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={editorState.isLink ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Link"
                  type="button"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLink();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={addLink} type="button">
                    Add Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Image */}
            <Dialog
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Image"
                  type="button"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add Image</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImage();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={addImage} type="button" className="text-white">
                    Add Image
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Editor */}
        <div className="min-h-[400px] relative">
          <EditorContent
            editor={editor}
            className="focus-within:outline-none"
          />
        </div>

        {/* Status Bar */}
        <div className="border-t border-black/10 p-2 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
          <div className="flex gap-4">
            <span>{editor.storage.characterCount.characters()} characters</span>
            <span>{editor.storage.characterCount.words()} words</span>
          </div>
          <div className="text-xs text-gray-500">
            Styles persist until explicitly changed • Use keyboard shortcuts for
            faster formatting
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
