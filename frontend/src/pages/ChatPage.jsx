import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { LoaderIcon, VideoIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client;

    const initChat = async () => {
      if (!authUser || !tokenData?.token) return;

      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData?.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error(error);
        toast.error("Could not connect to chat");
      } finally {
        setLoading(false);
      }
    };
    initChat();
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [authUser, tokenData, targetUserId]);


  const handleVideoCall = () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `I've started a video call. Join me here: ${callUrl}`,
    });

    toast.success("Video call link sent successfully!");
  };

  if (loading || !chatClient || !channel) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoaderIcon className="animate-spin size-10 text-primary" />
        <p className="mt-4 text-center text-lg font-mono">
          Connecting to chat...
        </p>
      </div>
    );
  }


  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
              <button
                onClick={handleVideoCall}
                className="btn btn-success btn-sm text-white"
              >
                <VideoIcon className="size-6" />
              </button>
            </div>

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;