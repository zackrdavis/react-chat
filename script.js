let id = 0

// chat history
const MessageList = ({sender, state}) => {
  let messages = state.messages;
  let typing = state.typing;

  // classname for final li
  let typingClass = typing && typing !== sender ? 'elipses typing' : 'elipses'

  const list = messages.map((message) => {
    return (<div key={message.id}>{message.sender} {message.text}</div>)
  });

  return (
    <div className="message-list">
      {list}
      <div className={typingClass}>...</div>
    </div>
  );
}

// text input
const MessageForm = ({sendMessage, sendTyping, sender}) => {
  let input;

  let handleChange = () => {
    sendTyping(sender)
  }

  return (
    <div className="message-form">
      <input onChange={handleChange} ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        sendMessage(input.value, sender);
        input.value = '';
      }}>
        +
      </button>
    </div>
  )
}

// single-user chat window
const ChatWindow = ({sender, sendMessage, sendTyping, state}) => {
  return (
    <div className="chat-outer">
      <div className="chat-inner">
        <div className="chat-header">{sender}</div>
        <MessageList sender={sender} state={state} />
        <MessageForm sendMessage={sendMessage} sendTyping={sendTyping} sender={sender} />
      </div>
    </div>
  )
}


class ChatApp extends React.Component {
  constructor(props) {
    // pass props to parent class
    super(props);
    // set initial state
    this.state = {
      messages: [],
      // either false or name of sender
      typing: false
    }
  }

  sendMessage(val, sender) {
    // Assemble data
    const message = {sender:sender, text: val, id: id++}
    // Update data
    this.state.messages.push(message);
    // Update state
    this.setState({messages: this.state.messages});
  }

  sendTyping(sender) {
    // Update data
    this.setState({typing: sender});
    setTimeout( () => {
      this.setState({typing: false});
    }, 1000)
  }

  render() {
    // chat window for each user
    return (
      <div>
        <ChatWindow
          sender = 'Laura'
          sendMessage = {this.sendMessage.bind(this)}
          sendTyping = {this.sendTyping.bind(this)}
          state = {this.state}
        />

        <ChatWindow
          sender = 'Rob'
          sendMessage = {this.sendMessage.bind(this)}
          sendTyping = {this.sendTyping.bind(this)}
          state = {this.state}
        />
      </div>
    )
  }
}

ReactDOM.render(<ChatApp />, document.getElementById('chat-app'))
