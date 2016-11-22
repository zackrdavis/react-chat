let id = 0

// chat history
const MessageList = ({user, state}) => {
  let messages = state.messages;
  let typing = state.typing;

  // classname for final li
  let typingClass = typing && typing !== user ? 'elipses typing' : 'elipses'

  const list = messages.map((message) => {
    return (<div key={message.id}>{message.user} {message.text}</div>)
  });

  return (
    <div className="message-list">
      {list}
      <div className={typingClass}>...</div>
    </div>
  );
}


// text input
const MessageForm = ({sendMessage, sendTyping, user}) => {
  let input;

  let handleChange = () => {
    sendTyping(user)
  }

  return (
    <div className="message-form">
      <input onChange={handleChange} ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        sendMessage(input.value, user);
        input.value = '';
      }}>
        +
      </button>
    </div>
  )
}


// single-user chat window
const ChatWindow = ({user, sendMessage, sendTyping, getSuggestions, state}) => {
  return (
    <div className="chat-outer">
      <div className="chat-inner">
        <div className="chat-header">{user}</div>
        <MessageList user={user} state={state} />
        <MessageForm sendMessage={sendMessage} sendTyping={sendTyping} user={user} />
      </div>
    </div>
  )
}

// coordinates ChatWindow-ChatWindow or ChatWindow-Server
class ChatApp extends React.Component {
  constructor(props) {
    // pass props to parent class
    super(props);
    // set initial state
    this.state = {
      users: [
        'Laura',
        'Rob',
        //'Jim'
      ],
      messages: [],
      suggestions: {},
      // either false or name of user
      typing: false
    }

    // init cleverBot
    this.bot = new cleverbot('lhH9sJn4zuuq2MTK', 'bKLf8nLE8EbXpFDFqdqr2J4svPOjMVYn');
    this.bot.setNick('react-chat');
    this.bot.create(function (err, session) {
      //console.log('bot is ready');
    })
  }

  consultBot(user, message) {
    console.log(message);

    this.bot.ask(message, (err, response) => {
      this.state.suggestions[user] = response;
      this.setState({ suggestions: this.state.suggestions })
    });

  }


  triggerSuggestions(sender, message) {
    let users = this.state.users;

    // for all users other than sender, consult bot for responses
    for (let i = 0; i < users.length; i++) {
      if(users[i] !== sender) {
        console.log(message);
        this.consultBot(users[i], message)
      }
    }
  }

  sendMessage(val, user) {
    // Assemble message data
    const message = {user:user, text: val, id: id++}

    // Update message data
    this.state.messages.push(message);
    this.setState({messages: this.state.messages});

    this.triggerSuggestions(user, val)
  }

  sendTyping(user) {
    // Update data
    this.setState({typing: user});
    setTimeout( () => {
      this.setState({typing: false});
    }, 1000)
  }

  render() {
    // build chat window for each user
    const windowList = this.state.users.map((user) => {
      return (
        <ChatWindow
          user = {user}
          sendMessage = {this.sendMessage.bind(this)}
          sendTyping = {this.sendTyping.bind(this)}
          state = {this.state}
        />
      )
    });

    return (
      <div>{windowList}</div>
    )
  }
}

ReactDOM.render(<ChatApp />, document.getElementById('chat-app'))
