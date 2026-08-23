package com.medifind.app.data.local

import androidx.room.TypeConverter
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types

/**
 * Room can only persist primitive columns directly — `recommendations` and
 * `redFlags` arrive from the backend as JSON string arrays (see
 * backend/prisma/schema.prisma Analysis.recommendations/redFlags), so they're
 * serialized to/from a single JSON TEXT column here.
 */
class Converters {

    private val moshi = Moshi.Builder().build()
    private val listType = Types.newParameterizedType(List::class.java, String::class.java)
    private val adapter = moshi.adapter<List<String>>(listType)

    @TypeConverter
    fun fromStringList(value: List<String>?): String =
        adapter.toJson(value ?: emptyList())

    @TypeConverter
    fun toStringList(value: String?): List<String> =
        if (value.isNullOrBlank()) emptyList() else (adapter.fromJson(value) ?: emptyList())
}
