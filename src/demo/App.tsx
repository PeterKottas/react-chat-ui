import * as React from 'react';
import {
  ChatFeed,
  Message,
  Author,
  ChatBubbleProps,
  ChatBubbleStyles,
  LastSeenAvatarStyles,
  AvatarStyles,
} from '../lib';
import { hot } from 'react-hot-loader';
import { getGravatarUrl } from './utils/getGravatarUrl';

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    backgroundColor: '#fff',
    borderColor: '#1D2129',
    borderStyle: 'solid',
    borderRadius: 20,
    borderWidth: 2,
    color: '#1D2129',
    fontSize: 18,
    fontWeight: 300,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  selected: {
    color: '#fff',
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
};

const customBubble: React.FC<ChatBubbleProps<string>> = (props) => (
  <div>
    <p>
      {props.author &&
        props.author.name +
          ' ' +
          (props.message.authorId !== props.yourAuthorId ? 'says' : 'said') +
          ': ' +
          props.message.message}
    </p>
  </div>
);

interface ChatState {
  authors: Author[];
  messages: Message<string>[];
  useCustomBubble: boolean;
  currentUser: number;
  messageText: string;
  simulateTyping: boolean;
  showAvatar: boolean;
  showLastSeen: boolean;
  showDateRow: boolean;
  showIsTyping: boolean;
  showLoadingMessages: boolean;
  hasOldMessages: boolean;
  firstAuthorTimer: number;
  secondAuthorTimer: number;
  useCustomStyles: boolean;
  useAvatarBg: boolean;
}

function useClickHandler<T = ChatState>(
  propertyName: keyof T,
  setState: React.Dispatch<React.SetStateAction<T>>
) {
  const handler = React.useCallback(() => {
    setState((t) => ({ ...t, [propertyName]: !t[propertyName] }));
  }, [propertyName]);
  return handler;
}

const chatBubbleStyles: ChatBubbleStyles = {
  chatBubble: {
    boxShadow: 'rgb(187 187 187) 0px 0px 2px 0',
  },
  recipientChatBubble: {
    backgroundColor: 'white',
  },
  userChatBubble: {
    color: 'white',
    backgroundColor: 'rgb(0, 132, 255)',
  },
};

const lastSeenAvatarStyles: LastSeenAvatarStyles = {
  container: {
    boxShadow: '#cacaca 0px 0px 10px 0px, rgb(187 187 187) 0px 0px 2px 0',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
};

const avatarStyles: AvatarStyles = {
  container: {
    boxShadow: '#cacaca 0px 0px 20px 0px, rgb(187 187 187) 0px 0px 2px 0',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
};

const style: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
};

const App: React.FC = () => {
  const chat: React.Ref<ChatFeed<string>> = React.useRef();

  const [
    {
      messageText,
      authors,
      currentUser,
      firstAuthorTimer,
      hasOldMessages,
      messages,
      secondAuthorTimer,
      showAvatar,
      showDateRow,
      showIsTyping,
      showLastSeen,
      showLoadingMessages,
      simulateTyping,
      useCustomBubble,
      useCustomStyles,
      useAvatarBg,
    },
    setState,
  ] = React.useState<ChatState>({
    authors: [
      {
        id: 0,
        name: 'You',
        bgImageUrl: getGravatarUrl(0),
      },
      {
        id: 1,
        name: 'Mark',
        isTyping: true,
        lastSeenMessageId: 7,
        bgImageUrl: getGravatarUrl(1),
      },
      {
        id: 2,
        name: 'Evan',
        isTyping: true,
        lastSeenMessageId: 7,
        bgImageUrl: getGravatarUrl(2),
      },
    ],
    messages: [
      {
        id: 0,
        authorId: 1,
        message: 'Hey guys!!',
        createdOn: new Date(2018, 2, 27, 18, 32, 24),
        isSend: true,
      },
      {
        id: 1,
        authorId: 2,
        message: 'Hey! Evan here. react-bell-chat is pretty dooope.',
        createdOn: new Date(2018, 2, 28, 18, 12, 24),
        isSend: true,
      },
      {
        id: 2,
        authorId: 2,
        message: 'Rly is.',
        createdOn: new Date(2018, 2, 28, 18, 13, 24),
        isSend: true,
      },
      {
        id: 3,
        authorId: 2,
        message: 'Long group.',
        createdOn: new Date(2018, 2, 28, 18, 13, 24),
        isSend: true,
      },
      {
        id: 4,
        authorId: 0,
        message: 'My message.',
        createdOn: new Date(2018, 2, 29, 19, 32, 24),
        isSend: true,
      },
      {
        id: 5,
        authorId: 0,
        message: 'One more.',
        createdOn: new Date(2018, 2, 29, 19, 33, 24),
        isSend: true,
      },
      {
        id: 6,
        authorId: 2,
        message: 'One more group to see the scroll.',
        createdOn: new Date(2018, 2, 29, 19, 35, 24),
        isSend: true,
      },
      {
        id: 7,
        authorId: 2,
        message: 'I said group.',
        createdOn: new Date(2018, 2, 29, 19, 35, 24),
        isSend: true,
      },
    ],
    useCustomBubble: false,
    currentUser: 0,
    messageText: '',
    simulateTyping: false,
    showAvatar: true,
    showDateRow: true,
    showLastSeen: true,
    showIsTyping: true,
    showLoadingMessages: true,
    hasOldMessages: true,
    firstAuthorTimer: undefined,
    secondAuthorTimer: undefined,
    useCustomStyles: true,
    useAvatarBg: true,
  });

  const onPress = React.useCallback((user: number) => {
    setState((prev) => ({ ...prev, currentUser: user }));
  }, []);

  const onMessageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMessage = e.target.value;
      setState((prev) => ({ ...prev, messageText: newMessage }));
    },
    []
  );

  const onLoadOldMessages = React.useCallback(
    () =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          setState((previousState) => ({
            ...previousState,
            messages: new Array(10)
              .fill(1)
              .map(
                (e, i) =>
                  ({
                    id: Number(new Date()),
                    createdOn: new Date(2017, 1, 1),
                    message: 'Old message ' + (i + 1).toString(),
                    authorId: Math.round(Math.random() + 1),
                  } as Message<string>)
              )
              .concat(previousState.messages),
          }));
          resolve();
        }, 1000)
      ),
    []
  );

  React.useEffect(() => chat.current?.scrollApi?.scrollToBottom?.(), [
    showIsTyping,
  ]);
  React.useEffect(
    () =>
      setState((prev) => ({
        ...prev,
        authors: prev.authors.map((a, i) => ({
          ...a,
          bgImageUrl: useAvatarBg ? getGravatarUrl(i) : undefined,
        })),
      })),
    [useAvatarBg]
  );

  const onUseCustomStylesClick = useClickHandler('useCustomStyles', setState);
  const onCustomBubblesClick = useClickHandler('useCustomBubble', setState);
  const onShowAvatarClick = useClickHandler('showAvatar', setState);
  const onShowDateRowClick = useClickHandler('showDateRow', setState);
  const onShowIsTypingClick = useClickHandler('showIsTyping', setState);
  const onShowLastSeenClick = useClickHandler('showLastSeen', setState);
  const onShowLoadingMessagesClick = useClickHandler(
    'showLoadingMessages',
    setState
  );
  const onUseAvatarBgClick = useClickHandler('useAvatarBg', setState);
  const onHasOldMessagesClick = useClickHandler('hasOldMessages', setState);

  const onSimulateMessageButtonClick = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.concat([
        {
          id: Number(new Date()),
          createdOn: new Date(),
          message: 'Simulated message',
          authorId: Math.round(Math.random() + 1),
        },
      ]),
    }));
  }, []);

  const onSystemMessageClick = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.concat([
        {
          id: Number(new Date()),
          createdOn: new Date(),
          message: 'System message',
        },
      ]),
    }));
  }, []);

  const onSimulateTypingButtonClick = React.useCallback(() => {
    if (simulateTyping) {
      clearInterval(firstAuthorTimer);
      clearInterval(secondAuthorTimer);
      setState((prev) => ({
        ...prev,
        simulateTyping: !simulateTyping,
        firstAuthorTimer: undefined,
        secondAuthorTimer: undefined,
      }));
    } else {
      let _firstAuthorTimer = window.setInterval(
        () =>
          setState((prev) => ({
            ...prev,
            authors: prev.authors
              .slice(0)
              .map((a, i) => (i === 1 ? a : { ...a, isTyping: !a.isTyping })),
          })),
        2000
      );
      let _secondAuthorTimer = window.setInterval(
        () =>
          setState((prev) => ({
            ...prev,
            authors: prev.authors
              .slice(0)
              .map((a, i) => (i === 2 ? a : { ...a, isTyping: !a.isTyping })),
          })),
        3200
      );
      setState((prev) => ({
        ...prev,
        firstAuthorTimer: _firstAuthorTimer,
        secondAuthorTimer: _secondAuthorTimer,
        simulateTyping: !simulateTyping,
      }));
    }
  }, [simulateTyping]);

  const onMessageSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (messageText !== '') {
        const id = Number(new Date());
        const newMessage: Message<string> = {
          id,
          authorId: currentUser,
          message: messageText,
          createdOn: new Date(),
          isSend: false,
        };
        setState((previousState) => ({
          ...previousState,
          messageText: '',
          messages: previousState.messages.concat(newMessage),
        }));
        chat.current?.onMessageSend?.();
        setTimeout(() => {
          setState((previousState) => ({
            ...previousState,
            messages: previousState.messages.map((m) =>
              m.id === id ? { ...m, isSend: true } : m
            ),
          }));
        }, 2000);
      }
      return true;
    },
    [messageText, currentUser]
  );

  return (
    <div className="container">
      <h1 className="text-center">react-bell-chat</h1>
      <p className="text-center">
        <a
          href="https://github.com/PeterKottas/react-bell-chat"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </p>
      <div className="install">
        <code>yarn add react-bell-chat</code>
      </div>
      <div className="chatfeed-wrapper">
        <ChatFeed<string>
          yourAuthorId={0}
          authors={authors}
          CustomChatBubble={useCustomBubble ? customBubble : undefined}
          style={useCustomStyles ? style : undefined}
          avatarStyles={useCustomStyles ? avatarStyles : undefined}
          lastSeenAvatarStyles={
            useCustomStyles ? lastSeenAvatarStyles : undefined
          }
          chatBubbleStyles={useCustomStyles ? chatBubbleStyles : undefined}
          maxHeight={350}
          messages={messages}
          showRecipientAvatar={showAvatar}
          ref={chat}
          showIsTyping={showIsTyping}
          showRecipientLastSeenMessage={showLastSeen}
          showDateRow={showDateRow}
          showLoadingMessages={showLoadingMessages}
          onLoadOldMessages={onLoadOldMessages}
          hasOldMessages={hasOldMessages}
        />

        <form onSubmit={(e) => onMessageSubmit(e)}>
          <input
            placeholder="Type a message..."
            className="message-input"
            value={messageText}
            onChange={onMessageChange}
          />
        </form>
        <div className="label mt-0 bt-0">Authors:</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button
            role="button"
            style={{
              ...styles.button,
              ...(currentUser === 0 ? styles.selected : {}),
            }}
            onClick={() => onPress(0)}
          >
            You
          </button>
          <button
            style={{
              ...styles.button,
              ...(currentUser === 1 ? styles.selected : {}),
            }}
            onClick={() => onPress(1)}
          >
            Mark
          </button>
          <button
            style={{
              ...styles.button,
              ...(currentUser === 2 ? styles.selected : {}),
            }}
            onClick={() => onPress(2)}
          >
            Evan
          </button>
        </div>
        <div className="label">Simulate input:</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 10,
          }}
        >
          <button
            style={{
              ...styles.button,
              ...(simulateTyping ? styles.selected : {}),
            }}
            onClick={onSimulateTypingButtonClick}
          >
            Simulate typing
          </button>
          <button
            style={{
              ...styles.button,
            }}
            onClick={onSimulateMessageButtonClick}
          >
            Simulate message
          </button>
          <button
            style={{
              ...styles.button,
            }}
            onClick={onSystemMessageClick}
          >
            System message
          </button>
        </div>
        <div className="label">Switches:</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 10,
          }}
        >
          <button
            style={{
              ...styles.button,
              ...(showAvatar ? styles.selected : {}),
            }}
            onClick={onShowAvatarClick}
          >
            Show avatar
          </button>
          <button
            style={{
              ...styles.button,
              ...(showIsTyping ? styles.selected : {}),
            }}
            onClick={onShowIsTypingClick}
          >
            Show typing
          </button>
          <button
            style={{
              ...styles.button,
              ...(showLastSeen ? styles.selected : {}),
            }}
            onClick={onShowLastSeenClick}
          >
            Show last seen
          </button>
          <button
            style={{
              ...styles.button,
              ...(showDateRow ? styles.selected : {}),
            }}
            onClick={onShowDateRowClick}
          >
            Show date row
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 10,
          }}
        >
          <button
            style={{
              ...styles.button,
              ...(useCustomBubble ? styles.selected : {}),
            }}
            onClick={onCustomBubblesClick}
          >
            Custom Bubbles
          </button>
          <button
            style={{
              ...styles.button,
              ...(showLoadingMessages ? styles.selected : {}),
            }}
            onClick={onShowLoadingMessagesClick}
          >
            Show Loading
          </button>
          <button
            style={{
              ...styles.button,
              ...(useCustomStyles ? styles.selected : {}),
            }}
            onClick={onUseCustomStylesClick}
          >
            Custom styles
          </button>
          <button
            style={{
              ...styles.button,
              ...(useAvatarBg ? styles.selected : {}),
            }}
            onClick={onUseAvatarBgClick}
          >
            Avatars
          </button>
          <button
            style={{
              ...styles.button,
              ...(hasOldMessages ? styles.selected : {}),
            }}
            onClick={onHasOldMessagesClick}
          >
            Has more messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default hot(module)(App);