import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_state.dart';
import 'package:rewarding_kids/features/parent/widgets/helpers/task_constants.dart';
class SubCategorySection extends StatelessWidget {
  const SubCategorySection({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AddTaskCubit, AddTaskState>(
      builder: (context, state) {
        final category = state.form.category;

        if (category == null) {
          return const SizedBox(); // 👈 مفيش حاجة
        }

        final list = subCategories[category] ?? [];

        return Wrap(
          spacing: 8,
          runSpacing: 8,
          children: list.map((sub) {
            final isSelected = state.form.subCategory == sub;

            return ChoiceChip(
              
              label: Text(sub,textAlign:  TextAlign.center,),
                showCheckmark: false,
             selectedColor:  Color(0xff984CFB),
              backgroundColor: Color(0xffE4E4E4),
              labelStyle: TextStyle(fontSize:14.sp,fontWeight: FontWeight.w400 ,color: isSelected ? Colors.white : Color(0xff60697B)),
                shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(8.r),
    side: BorderSide(
      color: 
           Colors.transparent
        
    ),
  ),
    padding:  EdgeInsets.symmetric(
    horizontal: 8.w,
    vertical: 8.h,
  ),
              
              selected: isSelected,
              onSelected: (_) {
                context.read<AddTaskCubit>().selectSubCategory(sub);
              },
            );
          }).toList(),
        );
      },
    );
  }
}
