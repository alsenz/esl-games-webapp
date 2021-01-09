import React from 'react';

import Reveal from 'reveal.js';
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js';

import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/league.css';
import './PresentationApp.css';


class PresentationApp extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        dummyList: ["Point 1"]
      };
    }
    
    componentDidMount() {
      console.log("COMPONENT DID MOUNT");
      this.deck = new Reveal({
        plugins: [ RevealMarkdown ],
        controls: true,
        embedded: true,
        navigationMode: "linear"
      });
      this.deck.initialize();
      console.log("deck: ", this.deck);
      console.dir(this.deck);
      setTimeout(() => {
        console.log("Timeout expired...");
        this.setState( prevState => ({
          dummyList: prevState.dummyList.concat(["Another item..."])
        }));
      }, 5000);
    }

  
    componentDidUpdate() {
      console.log("COMPONENT DID UPDATE...");
      this.deck.layout();
      this.deck.next();
    }
    
    render() {
      console.log("RENDER");
      let contentList = this.state.dummyList.map((item) => <li key={item} className="fragment">{item}</li>);
      return (
        <div className="reveal">
          <div className="slides">
            <section>Registration</section>
            <section data-transition="convex" data-markdown="">
              <textarea data-template>
## Content 1 Title
A paragraph with some text and a [link](http://hakim.se).
              </textarea>
            </section>
            <section data-transition="concave">
              <h3>Content 2</h3>
              <ul> { contentList } </ul>
            </section>
            <section>Credits</section>
          </div>
        </div>
      );
    }

}

export default PresentationApp;
