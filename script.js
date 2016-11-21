let id = 0

// chat history
const MessageList = ({messages}) => {
  const list = messages.map((message) => {
    return (<li key={message.id}>{message.sender} {message.text}</li>)
  });
  return (<ul>{list}</ul>);
}

// text input
const MessageForm = ({sendMessage, sender}) => {
  let input;
  return (
    <div>
      <input ref={node => {
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

// window for each user
const ChatWindow = ({sender, sendMessage, messages}) => {
  return (
    <div>
      <div>{sender}</div>
      <MessageList messages={messages} />
      <MessageForm sender={sender} sendMessage={sendMessage} />
    </div>
  )
}


class ChatApp extends React.Component{
  constructor(props) {
    // pass props to parent class
    super(props);
    // set initial state
    this.state = {
      data: []
    }
  }

  sendMessage(val, sender) {
    // Assemble data
    const message = {sender:sender, text: val, id: id++}
    // Update data
    this.state.data.push(message);
    // Update state
    this.setState({data: this.state.data});
  }

  render() {
    return (
      <div>
        <ChatWindow
          sender='Laura'
          sendMessage={this.sendMessage.bind(this)}
          messages={this.state.data}
        />

        <ChatWindow
          sender='Rob'
          sendMessage={this.sendMessage.bind(this)}
          messages={this.state.data}
        />
      </div>
    )
  }
}

ReactDOM.render(<ChatApp />, document.getElementById('chat-app'))
