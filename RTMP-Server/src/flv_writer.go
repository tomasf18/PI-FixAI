package main

import (
	"encoding/binary"
	"io"
)

type FLVWriter struct {
	w io.Writer
}

func NewFLVWriter(w io.Writer) *FLVWriter {
	writer := &FLVWriter{w: w}
	writer.writeHeader()
	return writer
}

func (fw *FLVWriter) writeHeader() {
	header := []byte{
		'F', 'L', 'V', // Signature
		1,             // Version
		1,             // Type flags: 0x01 = video only
		0, 0, 0, 9,    // Data offset: always 9
		0, 0, 0, 0,    // PreviousTagSize0 (always 0)
	}
	fw.w.Write(header)
}

func (fw *FLVWriter) WriteVideoTag(payload []byte, timestamp uint32) error {
	// FLV tag header (11 bytes)
	tagHeader := make([]byte, 11)
	tagHeader[0] = 0x09 // TagType: 0x09 = Video

	dataSize := len(payload) + 1
	tagHeader[1] = byte(dataSize >> 16)
	tagHeader[2] = byte(dataSize >> 8)
	tagHeader[3] = byte(dataSize)

	tagHeader[4] = byte(timestamp >> 16)
	tagHeader[5] = byte(timestamp >> 8)
	tagHeader[6] = byte(timestamp)
	tagHeader[7] = byte(timestamp >> 24) // Extended timestamp

	tagHeader[8] = 0x00 // StreamID
	tagHeader[9] = 0x00
	tagHeader[10] = 0x00

	if _, err := fw.w.Write(tagHeader); err != nil {
		return err
	}

	// Primeiro byte do VideoTag: FrameType (4 bits) + CodecID (4 bits)
	// Por ex: 0x17 = Keyframe (1) + AVC (7)
	frameType := byte(1) // 1 = keyframe, 2 = inter frame
	codecID := byte(7)   // AVC
	videoHeader := []byte{(frameType << 4) | codecID}

	if _, err := fw.w.Write(videoHeader); err != nil {
		return err
	}

	if _, err := fw.w.Write(payload); err != nil {
		return err
	}

	// PreviousTagSize: tagHeader + videoHeader + payload
	tagSize := uint32(11 + 1 + len(payload))
	binary.Write(fw.w, binary.BigEndian, tagSize)

	return nil
}
