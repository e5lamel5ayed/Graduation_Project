import 'package:flutter_bloc/flutter_bloc.dart';

part 'child_gender_state.dart';

class ChildGenderCubit extends Cubit<ChildGenderState> {
  ChildGenderCubit() : super(const ChildGenderState());

  void selectGender(String gender) {
    emit(state.copyWith(selectedGender: gender));
  }

  void setLoading(bool value) {
    emit(state.copyWith(isLoading: value));
  }
}
