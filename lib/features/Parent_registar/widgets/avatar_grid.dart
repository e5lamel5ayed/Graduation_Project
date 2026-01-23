import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class AvatarGrid extends StatelessWidget {
  final List<String> avatars;
  final int? selectedAvatar;
  final Function(int) onAvatarSelected;
  final Function(String) onCustomImagePicked;

  const AvatarGrid({
    super.key,
    required this.avatars,
    required this.selectedAvatar,
    required this.onAvatarSelected,
    required this.onCustomImagePicked,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: EdgeInsets.symmetric(horizontal: 12.w),
      itemCount: avatars.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 12.h,
        crossAxisSpacing: 10.w,
      ),
      itemBuilder: (context, index) {
        final isSelected = selectedAvatar == index;

        // --------- آخر آيتم = زر إضافة صورة ---------
        if (index == avatars.length - 1) {
          return GestureDetector(
            onTap: () async {
              final picker = ImagePicker();
              final picked = await picker.pickImage(source: ImageSource.gallery,);

              if (picked != null) {
                onCustomImagePicked(picked.path);
              }
            },
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.grey,
                  width: 2.w,
                ),
              ),
              child: SvgPicture.asset('assets/icons/add image.svg')
            ),
          );
        }

        // --------- آيتم الأفاتار العادي ---------
        return GestureDetector(
          onTap: () => onAvatarSelected(index),
          child: Container(
            padding: EdgeInsets.all(4.w),
            decoration: BoxDecoration(
              //shape: BoxShape.circle,
              border: Border.all(
                color: isSelected ? AppColors.ActiveColor : Colors.transparent,
                width: 3.w,
              ),
            ),
            child: SvgPicture.asset(avatars[index]),
          ),
        );
      },
    );
  }
}
//flutter build apk --release --split-per-abi  cd E:\StudioProjects\graduation_project2