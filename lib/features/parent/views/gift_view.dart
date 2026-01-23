import 'package:flutter/material.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/widgets/gifts_body.dart';

class GiftsView extends StatelessWidget {
  const GiftsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: AppColors.Background, body: GiftsBody());
  }
}
