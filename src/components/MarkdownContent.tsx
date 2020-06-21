import React from "react";

type PropType = {
  content: string;
};

type StateType = {
  height: number;
};

export default class extends React.Component<PropType, StateType> {
  el: React.RefObject<HTMLIFrameElement>;

  constructor(props: PropType) {
    super(props);
    this.state = { height: 0 };
    this.el = React.createRef();
  }

  componentDidMount() {
    const el = this.el.current;
    const doc = el?.contentDocument;
    if (!el || !doc) return;

    doc.head.innerHTML =
      '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">';
    doc.body.className = "markdown-body"; // github-markdown-css's parent class
    doc.body.style.margin = "0"; // make inner.body.offsetHeight equal to content height

    const handler = () => {
      // wait for re-render content
      setTimeout(() => {
        this.setState({ height: doc.body.offsetHeight });
      }, 0);
    };
    // fit height when click <details> tag
    el.contentWindow?.addEventListener("click", handler);
    // fit height when window resized and line-break changed
    el.contentWindow?.addEventListener("resize", handler);

    doc.body.innerHTML = this.props.content;
    this.setState({ height: doc.body.offsetHeight });
  }

  render() {
    const style = {
      border: "none",
      width: "100%",
      height: `${this.state.height}px`,
    };
    return (
      <iframe ref={this.el} sandbox="allow-same-origin" style={style}></iframe>
    );
  }
}
