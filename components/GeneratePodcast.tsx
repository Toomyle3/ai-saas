import { GeneratePodcastProps } from "#/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "#/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "#/components/ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { cn } from "#/lib/utils";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    if (!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [generatingContent, isGeneratingContent] = useState(false);
  const [promptsContext, setPromptsContext] = useState("");
  const handleGenerateContent = useAction(api.openai.generateScriptAction);
  const { toast } = useToast();

  const generateTextForPodcast = async () => {
    isGeneratingContent(true);
    if (!props?.voicePrompt || props?.voicePrompt === "") {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return isGeneratingContent(false);
    }
    const response = await handleGenerateContent({ prompt: promptsContext });
    props.setVoicePrompt(response);
    isGeneratingContent(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <div className="generate_prompt">
          <Button
            type="button"
            variant="plain"
            onClick={() => setIsAiThumbnail(true)}
            className={cn("", {
              "bg-black-6": isAiThumbnail,
            })}
          >
            Use AI to generate Prompt
          </Button>
          <Button
            type="button"
            variant="plain"
            onClick={() => setIsAiThumbnail(false)}
            className={cn("", {
              "bg-black-6": !isAiThumbnail,
            })}
          >
            Add Prompt to generate Podcast
          </Button>
        </div>
        {isAiThumbnail && (
          <div className="flex gap-10">
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide prompt text to AI"
              rows={3}
              value={promptsContext}
              onChange={(e: any) => setPromptsContext(e.target.value)}
            />
            <div className="mt-5 w-full max-w-[200px]">
              <Button
                type="submit"
                className="text-16 bg-green-500 py-4 font-bold text-white-1"
                onClick={generateTextForPodcast}
              >
                {generatingContent ? (
                  <>
                    Generating
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Generate Text"
                )}
              </Button>
            </div>
          </div>
        )}
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder={
            isAiThumbnail ? "Text from Ai" : "Provide text to generate audio"
          }
          rows={5}
          disabled={isAiThumbnail}
          value={props.voicePrompt}
          onChange={(e: any) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
