package com.medifind.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.medifind.app.data.local.entities.AnalysisEntity
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Database(
    entities = [AnalysisEntity::class],
    version = 1,
    exportSchema = false,
)
@TypeConverters(Converters::class)
abstract class MediFindDatabase : RoomDatabase() {
    abstract fun analysisDao(): AnalysisDao

    companion object {
        const val DATABASE_NAME = "medifind.db"
    }
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideMediFindDatabase(@ApplicationContext context: Context): MediFindDatabase =
        Room.databaseBuilder(context, MediFindDatabase::class.java, MediFindDatabase.DATABASE_NAME)
            // History cache only — safe to rebuild from the server on schema bump.
            .fallbackToDestructiveMigration()
            .build()

    @Provides
    @Singleton
    fun provideAnalysisDao(database: MediFindDatabase): AnalysisDao = database.analysisDao()
}
