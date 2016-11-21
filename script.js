let id = 0

// chat history
const MessageList = ({state}) => {
  let messages = state.data;
  let typing = state.typing;

  const list = messages.map((message) => {
    return (<li key={message.id}>{message.sender} {message.text}</li>)
  });

  return (<ul>{list}</ul>);
}

// text input
const MessageForm = ({sendMessage, sendTyping, sender}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        sendMessage(input.value, sender);
        sendTyping(sender);
        input.value = '';
      }}>
        +
      </button>
    </div>
  )
}

// single-user chat window
const ChatWindow = ({sender, sendMessage, sendTyping, state}) => {
  let senderIsTyping = sender === state.typing

  return (
    <div>
      <div>{sender}</div>
      <MessageList state={state} />
      <MessageForm sendMessage={sendMessage} sendTyping={sendTyping} sender={sender} />
    </div>
  )
}


class ChatApp extends React.Component {
  constructor(props) {
    // pass props to parent class
    super(props);
    // set initial state
    this.state = {
      data: [],
      typing: false
    }
  }

  sendMessage(val, sender) {
    // Assemble data
    const message = {sender:sender, text: val, id: id++}
    // Update data
    let messages = this.state.data
    messages.push(message);
    // Update state
    this.setState({data: this.state.data});
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
