// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserDataImpl _$$UserDataImplFromJson(Map<String, dynamic> json) =>
    _$UserDataImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      lastName: json['lastName'] as String?,
      contact: json['contact'] as String?,
      pspId: json['pspId'] as String?,
      contactType: json['contactType'] as String?,
    );

Map<String, dynamic> _$$UserDataImplToJson(_$UserDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'lastName': instance.lastName,
      'contact': instance.contact,
      'pspId': instance.pspId,
      'contactType': instance.contactType,
    };
