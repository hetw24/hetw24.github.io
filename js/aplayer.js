document.addEventListener('DOMContentLoaded', async () => {
  const container = document.createElement('div')
  container.id = 'aplayer'
  document.body.appendChild(container)

  const ap = new APlayer({
    container,
    fixed: true,
    mini: true,
    autoplay: false,
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    audio: []
  })

  try {
    const response = await fetch(
      'https://api.sighproxy.dpdns.org/api?server=netease&type=playlist&id=17523884381'
    )

    const data = await response.json()

    console.log('Meting API:', data)

    const songs = Array.isArray(data)
      ? data
      : data.data || data.songs || data.result?.songs || []

    const audio = songs.map(song => ({
      name: song.name || song.title || song.songName || '未知歌曲',
      artist:
        song.artist ||
        song.author ||
        song.ar?.map(a => a.name).join(' / ') ||
        song.artists?.map(a => a.name).join(' / ') ||
        '未知歌手',
      url: song.url || song.audio || song.mp3 || '',
      cover:
        song.pic ||
        song.picUrl ||
        song.cover ||
        song.coverUrl ||
        ''
    })).filter(song => song.url)

    if (!audio.length) {
      throw new Error('没有获取到可播放歌曲')
    }

    ap.list.add(audio)
  } catch (error) {
    console.error('网易云歌单加载失败:', error)
  }
})