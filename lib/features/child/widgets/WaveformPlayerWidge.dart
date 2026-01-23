import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:just_waveform/just_waveform.dart';
import 'package:path_provider/path_provider.dart';

class AudioPlayerController extends ChangeNotifier {
  final String audioFilePath;
  FlutterSoundPlayer? _player;
  bool isPlaying = false;
  bool loadingWaveform = true;
  Waveform? waveform;

  AudioPlayerController(this.audioFilePath) {
    _player = FlutterSoundPlayer();
    _player!.openPlayer();
  }

  // Getter للوصول للمدة
  Duration get duration => _player?.duration ?? Duration.zero;

  Future<void> loadWaveform() async {
    loadingWaveform = true;
    notifyListeners();

    waveform = await compute(_extractWaveform as ComputeCallback<String, Waveform?>, audioFilePath);

    loadingWaveform = false;
    notifyListeners();
  }

  void togglePlay() async {
    if (_player == null) return;

    if (!isPlaying) {
      await _player!.startPlayer(
        fromURI: audioFilePath,
        whenFinished: () {
          isPlaying = false;
          notifyListeners();
        },
      );
      isPlaying = true;
    } else {
      await _player!.stopPlayer();
      isPlaying = false;
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _player?.closePlayer();
    super.dispose();
  }
}

extension on FlutterSoundPlayer? {
  get duration => null;
}

// الدالة التي تعمل في isolate لاستخراج الـ waveform
Future<Stream<WaveformProgress>> _extractWaveform(String path) async {
  final waveOutFile = File('${(await getTemporaryDirectory()).path}/waveform_temp.wave');
  return await JustWaveform.extract(
    audioInFile: File(path),
    waveOutFile: waveOutFile,
  );
}
