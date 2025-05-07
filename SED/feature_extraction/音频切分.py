import pyaudio
import wave
import time
import datetime
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
#10s一次
RECORD_SECONDS = 11
WAVE_OUTPUT_FILENAME = 'data/real_wav/output{}.wav'
#录3个
EPOCH = 3
for e in range(EPOCH):
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("* recording")

    frames = []
    begin_time = datetime.datetime.now()
    path = "data/real_wav/" + str(begin_time).split(' ')[-1].split('.')[0].replace(":", "_") + '.wav'
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)
        if ((i+1) % int(RATE / CHUNK * 11) == 0):
            begin_time = datetime.datetime.now()
            path = "data/real_wav/" + str(begin_time).split(' ')[-1].split('.')[0].replace(":", "_") + '.wav'
            #wf = wave.open(WAVE_OUTPUT_FILENAME.format(str(int(i))), 'wb')
            wf = wave.open(path,"wb")
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(p.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))
            wf.close()
            frames.clear()

    print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()