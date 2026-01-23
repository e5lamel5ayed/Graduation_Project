import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

import '../cubit/progress_cubit.dart';
import '../cubit/progress_state.dart';

class PointsProgressBar extends StatelessWidget {
  final double minVisualProgress = 0.05; // أول 5% علشان الشكل ميبقاش فاضي

  PointsProgressBar({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProgressCubit, ProgressState>(
      builder: (context, state) {
        double realProgress =
        (state.totalPoints / state.goalPoints).clamp(0, 1);

        double visualProgress =
        realProgress == 0 ? minVisualProgress : realProgress;

        return Expanded(
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: MediaQuery.of(context).size.height*0.009,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(12.r),
                  ),
                  child: FractionallySizedBox(
                    widthFactor: visualProgress,
                    alignment: Alignment.centerLeft,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.r),
                        gradient: const LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            Color(0xffEFD8F3),
                            Color(0xffcD84DB),
                            Color(0xffcD84DB),
                          ],
                          stops: [0.0186, 0.5143, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 10.w),
              CustomText(
                text: "${state.totalPoints}",
                size: 16.sp,
                weight: FontWeight.w500,
                color: AppColors.descColor, iscenter: true,
              ),
            ],
          ),
        );
      },
    );
  }
}
