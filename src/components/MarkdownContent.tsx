import React, {useState, useEffect} from 'react';

type PropType = {
  content: string;
};

export default function MarkdownContent(props: PropType) {
  const elref = React.createRef<HTMLIFrameElement>();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = elref.current;
    const doc = el?.contentDocument;
    if (!el || !doc) return;

    doc.head.innerHTML =
      '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">';
    doc.body.className = 'markdown-body'; // github-markdown-css's parent class
    doc.body.style.margin = '0'; // make inner.body.offsetHeight equal to content height
    doc.body.style.height = 'fit-content'; // 明示的に指定しない場合、縦長のcommentを表示 -> 短いのを表示
    // した場合に直前のiframeのheightに引っ張られて大きいままになる

    const handler = () => {
      // wait for re-render content
      setTimeout(() => setHeight(doc.body.offsetHeight), 0);
    };
    // fit height when click <details> tag
    el.contentWindow?.addEventListener('click', handler);
    // fit height when window resized and line-break changed
    el.contentWindow?.addEventListener('resize', handler);

    doc.body.innerHTML = props.content;
    setHeight(doc.body.offsetHeight);
  }, [props.content]);

  const style = {
    border: 'none',
    width: '100%',
    height: `${height}px`,
  };
  return (
    <iframe
      ref={elref}
      style={style}
      sandbox="allow-same-origin"
      scrolling="no"
    ></iframe>
  );
}
