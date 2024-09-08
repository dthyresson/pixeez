import AlbumCell from 'src/components/AlbumCell'

const AlbumPage = ({ id }: { id: string }) => {
  return (
    <>
      <AlbumCell id={id} />
    </>
  )
}

export default AlbumPage
