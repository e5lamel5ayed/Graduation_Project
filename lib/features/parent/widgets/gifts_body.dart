import 'package:flutter/material.dart';
import 'package:rewarding_kids/features/parent/widgets/gifts_header.dart';

class GiftsBody extends StatefulWidget {
  const GiftsBody({super.key});

  @override
  State<GiftsBody> createState() => _GiftsBodyState();
}

class _GiftsBodyState extends State<GiftsBody> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [GiftsHeader()],
        ),
      ),
    );
  }
}
