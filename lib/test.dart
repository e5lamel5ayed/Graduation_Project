import 'package:flutter/material.dart';

class TestGif extends StatelessWidget {
  const TestGif({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Image.asset(
          'assets/animations/celebration_animation.gif',
        ),
      ),
    );
  }
}
