import 'package:flutter/material.dart';
import 'package:just_waveform/just_waveform.dart';
import 'dart:math';

class AudioWaveformWidget extends StatelessWidget {
  final Waveform waveform;
  final Duration start;
  final Duration duration;
  final Color waveColor;
  final double strokeWidth;
  final double pixelsPerStep;

  const AudioWaveformWidget({
    Key? key,
    required this.waveform,
    required this.start,
    required this.duration,
    this.waveColor = Colors.blue,
    this.strokeWidth = 3.0,
    this.pixelsPerStep = 6.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _WaveformPainter(
        waveform: waveform,
        start: start,
        duration: duration,
        waveColor: waveColor,
        strokeWidth: strokeWidth,
        pixelsPerStep: pixelsPerStep,
      ),
      size: const Size(double.infinity, 100),
    );
  }
}

class _WaveformPainter extends CustomPainter {
  final Waveform waveform;
  final Duration start;
  final Duration duration;
  final Color waveColor;
  final double strokeWidth;
  final double pixelsPerStep;

  _WaveformPainter({
    required this.waveform,
    required this.start,
    required this.duration,
    required this.waveColor,
    required this.strokeWidth,
    required this.pixelsPerStep,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = waveColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    if (duration == Duration.zero) return;

    final width = size.width;
    final height = size.height;
    final waveformPixelsPerWindow = waveform.positionToPixel(duration).toInt();
    final waveformPixelsPerDevicePixel = waveformPixelsPerWindow / width;
    final waveformPixelsPerStepLocal = waveformPixelsPerDevicePixel * pixelsPerStep;
    final sampleOffset = waveform.positionToPixel(start);
    final sampleStart = -sampleOffset % waveformPixelsPerStepLocal;

    for (var i = sampleStart.toDouble();
        i <= waveformPixelsPerWindow + 1.0;
        i += waveformPixelsPerStepLocal) {
      final sampleIdx = (sampleOffset + i).toInt();
      final x = i / waveformPixelsPerDevicePixel;
      final minY = normalise(waveform.getPixelMin(sampleIdx), height);
      final maxY = normalise(waveform.getPixelMax(sampleIdx), height);
      canvas.drawLine(
        Offset(x + strokeWidth / 2, max(strokeWidth * 0.75, minY)),
        Offset(x + strokeWidth / 2, min(height - strokeWidth * 0.75, maxY)),
        paint,
      );
    }
  }

  double normalise(int s, double height) {
    if (waveform.flags == 0) {
      final y = 32768 + s.toDouble();
      return height - 1 - y * height / 65536;
    } else {
      final y = 128 + s.toDouble();
      return height - 1 - y * height / 256;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
