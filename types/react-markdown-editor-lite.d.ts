declare module 'react-markdown-editor-lite' {
  import * as React from 'react';

  interface MdEditorProps {
    value?: string;
    style?: React.CSSProperties;
    renderHTML?: (text: string) => string;
    onChange?: (data: { text: string; html: string }) => void;
  }

  export default class MdEditor extends React.Component<MdEditorProps> {}
}
