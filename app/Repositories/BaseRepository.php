<?php

namespace App\Repositories;

use Illuminate\Support\Str;

abstract class BaseRepository
{
    protected $model;
    protected $canSearch = true;
    protected $canFilter = true;
    protected $canPaginate = true;

    /**
     *  Overide this repository Eloquent Model class name.
     *  This represents the Model to target for this
     *  repository instance. If this is not provided
     *  we will implicity define the class name
     */
    protected $modelClass;

    /**
     *  First thing is first, we need to set the Eloquent Model Instance of
     *  the target model class so that we can use the repository methods
     */
    public function __construct()
    {
        $this->setModel();
    }

    /**
     *  Set the model by resolving the provided Eloquent
     *  class name from the service container e.g
     *
     *  $this->model = resolve(App\Models\Project)
     *
     *  This means that our property "$this->model" is
     *  now an Eloquent Model Instance of Project.
     *
     *  Sometimes we can just pass our own specific model
     *  instance by passing it as a parameter e.g passing
     *  a "Project" model with id "1"
     *
     *  e.g $model = Project::find(1)
     *
     *  Or we can pass a model Eloquent Builder
     *
     *  e.g $model = User::find(1)->stores()
     *
     *  This is helpful to set an Eloquent Builder instance
     *  then chain other eloquent methods to execute queries
     */
    public function setModel($model = null)
    {

        if( ($model !== null) || ($this->model === null) ) {

            $this->model = $model ? $model : resolve($this->getModelClass());

        }

        /**
         *  Return the Repository Class instance.
         *  This is so that we can chain other methods if necessary
         */
        return $this;
    }

    private function getModelClass()
    {
        if( $this->modelClass === null ) {
            return $this->getFallbackModelClass();
        }
        return $this->getProvidedModelClass();
    }

    private function getProvidedModelClass()
    {
        /**
         *  Get the sub-class Eloquent Model class name, for instance,
         *  $this->resourceClass = Project::class"
         */
        return $this->modelClass;
    }

    private function getFallbackModelClass()
    {
        /**
         *  If the sub-class name is "ProjectRepository", then replace the
         *  word "Repository" with nothing and append the class path.
         *
         *  Return a fully qualified class path e.g App\Models\Project
         */
        return 'App\Models\\' . Str::replace('Repository', '', class_basename($this));
    }

    /**
     *  Disable the search functionality
     */
    protected function disableSearch()
    {
        $this->canSearch = false;
        return $this;
    }

    /**
     *  Disable the filter functionality
     */
    protected function disableFilter()
    {
        $this->canFilter = false;
        return $this;
    }

    /**
     *  Disable the pagination functionality
     */
    protected function disablePagination()
    {
        $this->canPaginate = false;
        return $this;
    }
}
