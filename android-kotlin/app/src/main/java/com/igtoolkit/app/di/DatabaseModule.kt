package com.igtoolkit.app.di

import android.content.Context
import androidx.room.Room
import com.igtoolkit.app.data.local.AppDatabase
import com.igtoolkit.app.data.local.DraftDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(context, AppDatabase::class.java, "ig-toolkit.db").build()
    }

    @Provides
    fun provideDraftDao(database: AppDatabase): DraftDao = database.draftDao()
}
