import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/Parent_registar/logic/child_gender_cubit.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/gendercard.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/progress_bar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class ChildGenderView extends StatelessWidget {
  const ChildGenderView({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final w = size.width;
    final h = size.height;

    return BlocProvider(
      create: (_) => ChildGenderCubit(),
      child: Scaffold(
        backgroundColor: AppColors.Background,
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: w * 0.07,
              vertical: h * 0.03,
            ),
            child: Column(
              children: [
                // ========== Back Button ==========
                Align(
                  alignment: Alignment.centerLeft,
                  child: Popbutton(
                    onPressed: () => context.go('/child_name'),
                  ),
                ),

                SizedBox(height: h * 0.02),

                // ========== Progress Bar ==========
                BlocBuilder<ChildGenderCubit, ChildGenderState>(
                  builder: (context, state) {
                    return AnimatedGradientProgress(progress: state.progress);
                  },
                ),

                SizedBox(height: h * 0.06),

                // ========== Title ==========
                CustomText(
                  text: "What's Your Child's Gender?",
                  color: AppColors.titleColor,
                  size: w * 0.055,
                  weight: FontWeight.w600,
                  iscenter: true,
                ),

                SizedBox(height: h * 0.01),

                CustomText(
                  text: "We will use this information to personalize the experience.",
                  color: AppColors.descobColor,
                  size: w * 0.035,
                  iscenter: true,
                ),

                SizedBox(height: h * 0.05),

                // ========== Gender Selection ==========
                BlocBuilder<ChildGenderCubit, ChildGenderState>(
                  builder: (context, state) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        GenderCard(
                          title: "Boy",
                          iconPath: "assets/icons/gender_boy.svg",
                          isSelected: state.selectedGender == "Boy",
                          onTap: () =>
                              context.read<ChildGenderCubit>().selectGender("Boy"),
                          gendercolor: AppColors.boycardcolor,
                        ),
                        GenderCard(
                          title: "Girl",
                          iconPath: "assets/icons/gender_girl.svg",
                          isSelected: state.selectedGender == "Girl",
                          onTap: () =>
                              context.read<ChildGenderCubit>().selectGender("Girl"),
                          gendercolor: AppColors.girlcardcolor,
                        ),
                      ],
                    );
                  },
                ),

                SizedBox(height: h * 0.05),

                // ========== Continue Button ==========
                BlocBuilder<ChildGenderCubit, ChildGenderState>(
                  builder: (context, state) {
                    return Custombutton(
                      text: state.isLoading ? "Loading..." : "Continue",
                      onPressed: () async {
                        if (state.selectedGender == null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please select gender first'),
                            ),
                          );
                          return;
                        }

                        final cubit = context.read<ChildGenderCubit>();
                        cubit.setLoading(true);

                        await Future.delayed(const Duration(seconds: 1));

                        cubit.setLoading(false);
                        context.go('/age');
                      },
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
