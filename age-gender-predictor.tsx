import { useState, useEffect, useRef } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Camera } from 'lucide-react';

const AgeGenderPredictor = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setVideoStream(stream);
          // Update age and gender when camera is started
          updateAgeAndGender();
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    } else if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  }, [isCameraActive]);

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  const updateAgeAndGender = () => {
    // Mock prediction function
    const predictedAge = Math.floor(Math.random() * 100);
    const predictedGender = Math.random() < 0.5 ? 'Male' : 'Female';
    setAge(predictedAge);
    setGender(predictedGender);
  };

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleStopCamera = () => {
    setIsCameraActive(false);
    // Update age and gender when camera is stopped
    updateAgeAndGender();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      // Update age and gender when image is selected
      updateAgeAndGenderFromImage(file);
    }
  };

  const updateAgeAndGenderFromImage = (image: File) => {
    // Mock prediction function
    const predictedAge = Math.floor(Math.random() * 100);
    const predictedGender = Math.random() < 0.5 ? 'Male' : 'Female';
    setAge(predictedAge);
    setGender(predictedGender);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Age and Gender Predictor</CardTitle>
      </CardHeader>
      <CardContent>
        {isCameraActive ? (
          <video ref={videoRef} className="w-full h-64 object-cover" />
        ) : (
          <div className="flex justify-center items-center h-64">
            <Camera className="h-12 w-12" />
          </div>
        )}
        {age && gender && (
          <div className="mt-4">
            <p>Predicted Age: {age}</p>
            <p>Predicted Gender: {gender}</p>
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-4"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Selected Image"
            className="w-full h-64 object-cover mt-4"
          />
        )}
      </CardContent>
      <footer className="flex justify-center mt-4">
        {isCameraActive ? (
          <Button variant="destructive" onClick={handleStopCamera}>
            Stop Camera
          </Button>
        ) : (
          <Button variant="primary" onClick={handleStartCamera}>
            Start Camera
          </Button>
        )}
        <Button variant="primary" onClick={() => imageRef.current?.click()} className="ml-4">
          Select Image
        </Button>
      </footer>
    </Card>
  );
};

export default AgeGenderPredictor;