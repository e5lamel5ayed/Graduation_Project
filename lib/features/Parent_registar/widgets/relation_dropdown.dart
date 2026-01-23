import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class RelationDropdown extends StatefulWidget {
  final String? selectedRelation;
  final ValueChanged<String?> onChanged;

  const RelationDropdown({
    super.key,
    required this.selectedRelation,
    required this.onChanged,
  });

  @override
  State<RelationDropdown> createState() => _RelationDropdownState();
}

class _RelationDropdownState extends State<RelationDropdown> {
  bool isExpanded = false;
  final List<String> relations = ["Mother", "Father", "Brother", "Sister", "Nanny"];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // الزر الرئيسي
        GestureDetector(
          onTap: () {
            setState(() {
              isExpanded = !isExpanded;
            });
          },
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: size.width * 0.04,
              vertical: size.height * 0.018,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12).r,
              border: Border.all(color: Colors.white, width: 1.5.w),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.selectedRelation ?? "who are you",
                  style: TextStyle(
                    color: widget.selectedRelation == null
                        ? Colors.grey
                        : AppColors.descColor,
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Icon(
                  isExpanded
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: AppColors.descColor,
                ),
              ],
            ),
          ),
        ),

        // اللستة اللي بتفتح تحت الزرار
        AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          height: isExpanded ? size.height * 0.22 : 0,
          curve: Curves.easeInOut,
          child: Visibility(
            visible: isExpanded,
            child: Container(
              margin: EdgeInsets.only(top: size.height * 0.008),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.r),
                border: Border.all(color: Colors.white, width: 1.2),
              ),
              child: ListView.separated(
                padding: EdgeInsets.zero,
                itemCount: relations.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final relation = relations[index];
                  return ListTile(
                    title: Text(relation),
                    onTap: () {
                      widget.onChanged(relation);
                      setState(() {
                        isExpanded = false;
                      });
                    },
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );
  }
}
