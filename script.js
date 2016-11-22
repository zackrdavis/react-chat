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
        // 'Jim'
      ],
      messages: [],
      suggestions: {},
      // either false or name of user
      typing: false
    }

    // init cleverBot
    this.bot = new cleverbot('lhH9sJn4zuuq2MTK', 'bKLf8nLE8EbXpFDFqdqr2J4svPOjMVYn');
    this.bot.setNick('react-chat');
    this.bot.create((err, session) => {
      //console.log('bot is ready');
    })
  }

  consultBot(user, message) {
    // TODO: error handling
    this.bot.ask(message, (err, firstResponse) => {
      this.bot.ask(message, (err, secondResponse) => {
        this.state.suggestions[user] = []
        // push first response
        this.state.suggestions[user].push(firstResponse);
        // push second response only if it's unique
        if(secondResponse !== firstResponse) {
          this.state.suggestions[user].push(secondResponse);
        }
        // push another helpful answer
        this.state.suggestions[user].push('One moment while I consult my manager...');
        // set state
        this.setState({ suggestions: this.state.suggestions })
      })
    });
  }


  triggerSuggestions(sender, message) {
    let users = this.state.users;

    // for all users other than sender, consult bot for responses
    for (let i = 0; i < users.length; i++) {
      if(users[i] !== sender) {
        this.consultBot(users[i], message)
      }
    }
  }

  removeSentSuggestion(user, val) {
    let userSuggestions = this.state.suggestions[user];

    // if sent message matches a suggestion, remove the suggestion
    if(userSuggestions && userSuggestions.indexOf(val) !== -1) {
      userSuggestions.splice(userSuggestions.indexOf(val), 1);
      this.setState({ suggestions: this.state.suggestions })
    }
  }

  sendMessage(val, user) {
    // Assemble message data
    const message = {user:user, text: val, id: id++}

    // Update message data
    this.state.messages.push(message);
    this.setState({messages: this.state.messages});

    this.triggerSuggestions(user, val)
    this.removeSentSuggestion(user, val)
  }

  sendTyping(user) {
    this.setState({typing: user});
    // TODO: debounce
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


// chat history
let id = 0
const MessageList = ({user, state}) => {
  let messages = state.messages;
  let typing = state.typing;

  // show or hide elipses
  let typingClass = typing && typing !== user ? 'elipses typing' : 'elipses';

  const list = messages.map((message) => {
    // left or right side depending on sender/receiver
    let youMeClass = user === message.user ? 'self message' : 'other message';

    // hide username if they sent multiple messages in a row
    let userNameClass;
    if(messages[message.id - 1] && messages[message.id - 1].user === message.user) {
      userNameClass = 'user-name-hide'
    } else {
      userNameClass = 'user-name-show'
    }

    return (
      <div key={message.id} className={youMeClass}>
        <span className={userNameClass}>{message.user}:</span>{message.text}
      </div>
    )
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
    <form className="message-form" onSubmit={() => {
      event.preventDefault()
      if(input.value) {
        sendMessage(input.value, user);
        input.value = '';
      }
    }}>
      <div className="message-form-inner">
        <input onChange={handleChange} ref={node => {
          input = node;
        }} />
        <button type="submit">+</button>
      </div>
    </form>
  )
}


// bot-generated suggestions list
const SuggestionList = ({sendMessage, suggestions, user}) => {
  // build list if suggestions exist
  if(suggestions) {
    const list = suggestions.map((suggestion) => {
      return (
        <div onClick={() => {
          sendMessage(suggestion, user);
        }}>{suggestion}</div>
      )
    });
    return (
      <div className="suggestion-list">
        {list}
      </div>
    )
  // else build empty list
  } else {
    return (<div className="suggestion-list"></div>)
  }
}


// single-user chat window
const ChatWindow = ({user, sendMessage, sendTyping, state}) => {
  return (
    <div className="chat-outer">
      <div className="chat-inner">
        <div className="chat-header">{user}</div>
        <MessageList user={user} state={state} />
        <MessageForm sendMessage={sendMessage} sendTyping={sendTyping} user={user} />
        <SuggestionList sendMessage={sendMessage} suggestions={state.suggestions[user]} user={user}/>
      </div>
    </div>
  )
}

ReactDOM.render(<ChatApp />, document.getElementById('chat-app'))
