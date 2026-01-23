import 'package:flutter/material.dart';

class CelebrationGIF extends StatelessWidget {
  const CelebrationGIF({super.key, required this.show});

  final bool show;

  @override
  Widget build(BuildContext context) {
    if (!show) return const SizedBox.shrink();

    return Image.asset(
      'assets/animations/celebration_animation.gif',
      width: double.infinity,
      height: MediaQuery.of(context).size.height*0.342,
    );
  }
}
