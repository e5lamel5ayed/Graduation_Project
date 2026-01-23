part of 'child_gender_cubit.dart';

class ChildGenderState {
  final String? selectedGender;
  final bool isLoading;

  const ChildGenderState({
    this.selectedGender,
    this.isLoading = false,
  });

  // هنا بنحسب الـ progress بناءً على اختيار الجنس
  double get progress => selectedGender == null ? 0.2 : 0.4;

  ChildGenderState copyWith({
    String? selectedGender,
    bool? isLoading,
  }) {
    return ChildGenderState(
      selectedGender: selectedGender ?? this.selectedGender,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}
