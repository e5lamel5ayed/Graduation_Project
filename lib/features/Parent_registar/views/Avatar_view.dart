import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/progress_bar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/avatar_grid.dart';

class AvatarView extends StatefulWidget {
  const AvatarView({super.key});

  @override
  State<AvatarView> createState() => _AvatarViewState();
}

class _AvatarViewState extends State<AvatarView> {
  int? selectedAvatar;

  List<String> avatars = [
    'assets/avatars/avatar1.svg',
    'assets/avatars/avatar2.svg',
    'assets/avatars/avatar3.svg',
    'assets/avatars/avatar4.svg',
    'assets/avatars/avatar5.svg',
    'assets/avatars/avatar6.svg',
    'assets/avatars/avatar7.svg',
    'assets/avatars/avatar8.svg',
    'assets/avatars/avatar9.svg',
    'assets/avatars/avatar10.svg',
    'assets/avatars/avatar11.svg',
    'ADD_IMAGE', // آخر واحدة زر إضافة
  ];

  @override
  Widget build(BuildContext context) {
    final h = 1.sh;

    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// Back button
              Row(
                children: [
                  Popbutton(onPressed: () => context.go('/relation')),
                ],
              ),
              SizedBox(height: h * 0.02),

              /// Progress
              AnimatedGradientProgress(progress: 1),
              SizedBox(height: h * 0.03),

              /// Title
              Center(
                child: Column(
                  children: [
                    Text(
                      "Choose Child Avatar",
                      style: TextStyle(
                        fontSize: 24.sp,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: h * 0.01),
                    Text(
                      "Express avatar to enjoy kid character vibe",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 14.sp,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              SizedBox(height: h * 0.03),

              /// Avatar Grid
              SizedBox(
                height: h * 0.42, // الجريد ثابت عشان زرار Continue يبقى قريب
                child: AvatarGrid(
                  avatars: avatars,
                  selectedAvatar: selectedAvatar,
                  onAvatarSelected: (index) {
                    setState(() {
                      selectedAvatar = index;
                    });
                  },
                  onCustomImagePicked: (path) {
                    setState(() {
                      avatars[avatars.length - 1] = path;
                      selectedAvatar = avatars.length - 1;
                    });
                  },
                ),
              ),

              SizedBox(height: h * 0.03),

              /// Continue Button
              Custombutton(
                text: "Continue",
                onPressed: () {
                  context.go("/account_done");
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
