import React, { useEffect, useState } from 'react'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'
import './App.css'
export default () => {

  const [ movieList , setMovieList ] = useState([])
  const [ featuredData , setfeaturedData ] = useState(null)
  const [ blackHeader, setBlackHeader ] = useState(false)
  useEffect(()=>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList()
      setMovieList(list)
      
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setfeaturedData(chosenInfo)
    }

    loadAll()
  },[])

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])
  return(
    <>
    <Header black={blackHeader}/>  
      <div className="page">
        {featuredData && <FeaturedMovie item={featuredData}/>}
        
        <section className="lists">
        {movieList.map((item, key)=>(
            <MovieRow key={key} title={item.title} items={item.items}/>
          ))}
        </section>
        <footer>
        Feito em Live (https://www.youtube.com/watch?v=tBweoUiMsDg) para estudo de react, todos os direitos das imagens são da Netflix.
        Dados Extraidos de https://www.themoviedb.org/
        </footer>

        {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="Carregando ..."/>        
        </div>
        }
      </div>
    </>
  )
}