import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class TestSound extends StatefulWidget {
  const TestSound({super.key});

  @override
  State<TestSound> createState() => _TestSoundState();
}

class _TestSoundState extends State<TestSound> {
  final AudioPlayer player = AudioPlayer();

  @override
  void initState() {
    super.initState();
    _play();
  }

  void _play() async {
    try {
      await player.play(AssetSource('celebration_sound.mp3'));
      print("PLAYING SUCCESS");
    } catch (e) {
      print("ERROR >>> $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text("Testing Sound")),
    );
  }
}
